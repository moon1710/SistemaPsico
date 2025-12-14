#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Reporte de alumnos que NO han realizado ningún quiz
---------------------------------------------------
- Toma estudiantes (rol = ESTUDIANTE).
- Por defecto considera SOLO quizzes activos.
- Marca como "NO LO HIZO" a quienes no tienen ninguna fila en respuestas_quiz
  (para esos quizzes considerados).

Uso (ejemplo):
  python reporte_no_hizo_quiz.py ^
    --host 127.0.0.1 --port 3306 ^
    --user root --password "mon123" ^
    --database sistema_educativo ^
    --outfile reporte_no_hizo.xlsx
"""
import argparse
import sys
from datetime import datetime
import re

import pandas as pd
import mysql.connector as mc

# ============= CONEXIÓN =============
def connect_mysql(host, port, user, password, database):
    try:
        return mc.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            database=database,
            autocommit=False,
        )
    except mc.Error as e:
        print(f"[ERROR] No se pudo conectar a MySQL: {e}")
        sys.exit(1)

# ============= QUERIES =============
def fetch_core(conn, only_active=True):
    # Estudiantes
    users_sql = """
        SELECT
            u.id AS usuarioId,
            u.carrera,
            u.email,
            u.nombreCompleto,
            u.matricula,
            u.genero,
            u.telefono,
            u.semestre,
            UPPER(COALESCE(u.grupo, '')) AS grupo,
            u.turno
        FROM usuarios u
        WHERE u.rol = 'ESTUDIANTE'
          AND u.perfilCompletado = 1
    """
    # Quizzes
    quizzes_sql = """
        SELECT id AS quizId, codigo, titulo, activo
        FROM quizzes
    """
    # Respuestas
    respuestas_sql = """
        SELECT id, usuarioId, quizId, completado, fechaEnvio
        FROM respuestas_quiz
    """

    users = pd.read_sql(users_sql, conn)
    quizzes = pd.read_sql(quizzes_sql, conn)
    respuestas = pd.read_sql(respuestas_sql, conn)

    # Normaliza carrera y grupo
    users["grupo"] = users["grupo"].fillna("").astype(str).str.upper()
    users.loc[users["grupo"] == "", "grupo"] = "SIN GRUPO"
    users["carrera"] = users["carrera"].fillna("SIN CARRERA")

    # Filtra respuestas a quizzes activos (si aplica)
    if only_active and not quizzes.empty:
        activos = set(quizzes.loc[quizzes["activo"] == 1, "quizId"].astype(str))
        respuestas = respuestas[respuestas["quizId"].astype(str).isin(activos)]

    return users, quizzes, respuestas

# ============= LÓGICA: QUIÉNES NO LO HICIERON =============
def compute_no_hizo(users_df, respuestas_df):
    """
    Devuelve:
      - detalle_no_hizo: alumnos que NO tienen ninguna respuesta
      - resumen_no_hizo: conteo por (carrera, grupo)
    """
    if users_df.empty:
        detalle = pd.DataFrame(columns=["matricula","nombreCompleto","email","carrera","grupo"])
        resumen = pd.DataFrame(columns=["carrera","grupo","total_alumnos","no_hizo","pct_no_hizo"])
        return detalle, resumen

    # Usuarios que sí tienen al menos una respuesta
    if respuestas_df.empty:
        # Nadie ha respondido nada -> todos "no lo hicieron"
        no_hizo = users_df.copy()
    else:
        responded_ids = set(respuestas_df["usuarioId"].astype(str).unique())
        no_hizo = users_df[~users_df["usuarioId"].astype(str).isin(responded_ids)].copy()

    # Detalle amigable
    detalle = no_hizo[[
        "matricula",
        "nombreCompleto",
        "email",
        "carrera",
        "grupo",
        "semestre",
        "turno",
        "telefono",
        "genero",
    ]].sort_values(["carrera","grupo","nombreCompleto"], kind="stable")

    # Resumen por carrera y grupo
    total_grp = (
        users_df.groupby(["carrera","grupo"], dropna=False)
        .size()
        .rename("total_alumnos")
        .reset_index()
    )
    no_hizo_grp = (
        no_hizo.groupby(["carrera","grupo"], dropna=False)
        .size()
        .rename("no_hizo")
        .reset_index()
    )

    resumen = total_grp.merge(no_hizo_grp, on=["carrera","grupo"], how="left")
    resumen["no_hizo"] = resumen["no_hizo"].fillna(0).astype(int)
    resumen["pct_no_hizo"] = ((resumen["no_hizo"] / resumen["total_alumnos"]) * 100).round(1)

    resumen = resumen.sort_values(["carrera","grupo"], kind="stable")

    return detalle, resumen

# ============= HELPERS EXCEL =============
def auto_fit_columns(ws, df, start_col=1, max_width=48):
    from openpyxl.utils import get_column_letter

    if df is None or df.empty:
        return
    for i, col in enumerate(df.columns, start_col):
        series = df[col].astype(str)
        if series.empty:
            max_len = len(str(col))
        else:
            max_len = max([len(str(col))] + [len(s) for s in series.tolist()])
        ws.column_dimensions[get_column_letter(i)].width = min(max(12, max_len + 2), max_width)

def _sanitize_table_name(name: str) -> str:
    import uuid
    base = re.sub(r"[^A-Za-z0-9_]", "_", str(name))
    if not re.match(r"^[A-Za-z_]", base):
        base = f"T_{base}"
    unique = uuid.uuid4().hex[:6]
    return (f"{base}_{unique}")[:31]

def apply_table_style(ws, df, table_name="Tabla1", start_row=3, start_col=1):
    from openpyxl.worksheet.table import Table, TableStyleInfo
    from openpyxl.utils import get_column_letter

    if df is None or df.empty:
        return
    end_row = start_row + len(df)
    end_col = start_col + len(df.columns) - 1
    ref = f"{get_column_letter(start_col)}{start_row}:{get_column_letter(end_col)}{end_row}"
    tbl = Table(displayName=_sanitize_table_name(table_name), ref=ref)
    style = TableStyleInfo(
        name="TableStyleMedium9",
        showFirstColumn=False,
        showLastColumn=False,
        showRowStripes=True,
        showColumnStripes=False,
    )
    tbl.tableStyleInfo = style
    ws.add_table(tbl)

def write_df(ws, df, title, subtitle=None, table_base="Tabla"):
    from openpyxl.styles import Font, Alignment
    from openpyxl.utils.dataframe import dataframe_to_rows

    # Título
    ws.merge_cells(start_row=1, start_column=1, end_row=1, end_column=max(df.shape[1], 1))
    ws["A1"] = title
    ws["A1"].font = Font(name="Montserrat", bold=True, size=14)
    ws["A1"].alignment = Alignment(horizontal="left", vertical="center")

    if subtitle:
        ws.merge_cells(start_row=2, start_column=1, end_row=2, end_column=max(df.shape[1], 1))
        ws["A2"] = subtitle
        ws["A2"].font = Font(name="Montserrat", size=11)

    # Datos
    start_row = 3
    for r_idx, row in enumerate(dataframe_to_rows(df, index=False, header=True), start_row):
        for c_idx, value in enumerate(row, 1):
            ws.cell(row=r_idx, column=c_idx, value=value)

    ws.auto_filter.ref = ws.dimensions
    ws.freeze_panes = ws["A4"]
    auto_fit_columns(ws, df, start_col=1)
    apply_table_style(ws, df, table_name=table_base, start_row=start_row, start_col=1)

# ============= ESCRITURA EXCEL =============
def write_excel(outfile, detalle_df, resumen_df):
    with pd.ExcelWriter(outfile, engine="openpyxl", datetime_format="yyyy-mm-dd hh:mm:ss") as writer:
        # README
        readme = pd.DataFrame(
            {
                "Información": [
                    "REPORTE DE ALUMNOS QUE NO HAN REALIZADO NINGÚN QUIZ",
                    "",
                    "Hojas:",
                    " - README",
                    " - Resumen_no_hizo: conteo por carrera y grupo.",
                    " - Detalle_no_hizo: listado de alumnos que no tienen ninguna respuesta registrada.",
                    "",
                    "Notas:",
                    " - Se consideran por defecto solo quizzes activos (cambiar con --only_active 0).",
                    " - Si un alumno no aparece en 'Detalle_no_hizo', es porque sí tiene al menos un intento.",
                ]
            }
        )
        readme.to_excel(writer, index=False, sheet_name="README")
        write_df(writer.sheets["README"], readme, "README", "Cómo leer este reporte", "ReadmeTable")

        # Resumen
        resumen_df.to_excel(writer, index=False, sheet_name="Resumen_no_hizo")
        write_df(
            writer.sheets["Resumen_no_hizo"],
            resumen_df,
            "Resumen de alumnos que NO han realizado ningún quiz",
            f"Generado: {datetime.now():%Y-%m-%d %H:%M}",
            "ResumenNoHizo",
        )

        # Detalle
        detalle_df.to_excel(writer, index=False, sheet_name="Detalle_no_hizo")
        write_df(
            writer.sheets["Detalle_no_hizo"],
            detalle_df,
            "Detalle de alumnos que NO han realizado ningún quiz",
            "Un alumno por fila",
            "DetalleNoHizo",
        )

# ============= MAIN =============
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--host", default="127.0.0.1")
    ap.add_argument("--port", type=int, default=3306)
    ap.add_argument("--user", default="root")
    ap.add_argument("--password", default="")
    ap.add_argument("--database", default="sistema_educativo")
    ap.add_argument("--outfile", default="reporte_no_hizo.xlsx")
    ap.add_argument(
        "--only_active",
        type=int,
        default=1,
        help="1 = solo quizzes activos, 0 = todos los quizzes",
    )
    args = ap.parse_args()

    conn = connect_mysql(args.host, args.port, args.user, args.password, args.database)
    try:
        users_df, quizzes_df, respuestas_df = fetch_core(conn, only_active=bool(args.only_active))
        detalle_df, resumen_df = compute_no_hizo(users_df, respuestas_df)
    finally:
        conn.close()

    write_excel(args.outfile, detalle_df, resumen_df)
    print(f"[OK] Reporte generado: {args.outfile}")

if __name__ == "__main__":
    main()
