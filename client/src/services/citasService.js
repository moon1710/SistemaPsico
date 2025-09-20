// client/src/services/citasService.js
// Uses your existing axios instance at client/src/utils/api.js
// If your path differs (e.g., api/index.js), adjust the import below.
import api from "../services/api";

const INSTITUTION_HEADER = "X-Institucion-Id";

/** Merge optional institution header */
function withInstitutionHeader(institutionId) {
  return institutionId ? { [INSTITUTION_HEADER]: String(institutionId) } : {};
}

/** GET /api/citas/requests/open */
export async function getOpenRequests({ institutionId } = {}) {
  const res = await api.get("/citas/requests/open", {
    headers: withInstitutionHeader(institutionId),
  });
  return res.data;
}

/** POST /api/citas/:id/claim */
export async function claimRequest(id, { institutionId } = {}) {
  const res = await api.post(
    `/citas/${id}/claim`,
    {},
    { headers: withInstitutionHeader(institutionId) }
  );
  return res.data;
}

/** POST /api/citas/:id/release */
export async function releaseRequest(id, { institutionId } = {}) {
  const res = await api.post(
    `/citas/${id}/release`,
    {},
    { headers: withInstitutionHeader(institutionId) }
  );
  return res.data;
}

/** POST /api/citas/:id/schedule  body: { fechaHora, duracion } */
export async function scheduleRequest(
  id,
  { fechaHora, duracion },
  { institutionId } = {}
) {
  const res = await api.post(
    `/citas/${id}/schedule`,
    { fechaHora, duracion },
    { headers: withInstitutionHeader(institutionId) }
  );
  return res.data;
}

/** GET /api/citas/slots?from=&to=&psicologoId= */
export async function getOpenSlots({
  from,
  to,
  psicologoId,
  institutionId,
} = {}) {
  const res = await api.get("/citas/slots", {
    params: { from, to, psicologoId },
    headers: withInstitutionHeader(institutionId),
  });
  return res.data;
}

/** POST /api/citas/slots  body:{ blocks:[{fechaHora,duracion}] } */
export async function publishSlots({ blocks }, { institutionId } = {}) {
  const res = await api.post(
    "/citas/slots",
    { blocks },
    { headers: withInstitutionHeader(institutionId) }
  );
  return res.data;
}

/** POST /api/citas/slots/:id/book */
export async function bookSlot(slotId, { institutionId } = {}) {
  const res = await api.post(
    `/citas/slots/${slotId}/book`,
    {},
    { headers: withInstitutionHeader(institutionId) }
  );
  return res.data;
}

/** GET /api/citas/mine?role=STAFF|STUDENT */
export async function getMyAppointments({ role, institutionId } = {}) {
  const res = await api.get("/citas/mine", {
    params: { role },
    headers: withInstitutionHeader(institutionId),
  });
  return res.data;
}

/** POST /api/citas/:id/status  body:{ estado } */
export async function updateStatus(id, { estado }, { institutionId } = {}) {
  const res = await api.post(
    `/citas/${id}/status`,
    { estado },
    { headers: withInstitutionHeader(institutionId) }
  );
  return res.data;
}

export { INSTITUTION_HEADER };
