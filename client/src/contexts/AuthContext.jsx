import React, { createContext, useContext, useReducer, useEffect } from "react";
import authService from "../services/authService";
import { MESSAGES } from "../utils/constants";

// Estados posibles
const AUTH_STATES = {
  IDLE: "idle",
  LOADING: "loading",
  AUTHENTICATED: "authenticated",
  UNAUTHENTICATED: "unauthenticated",
  ERROR: "error",
};

// Acciones del reducer
const AUTH_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGOUT: "LOGOUT",
  UPDATE_USER: "UPDATE_USER",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
};

// Estado inicial
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  status: AUTH_STATES.IDLE,
};

// Reducer para manejar el estado de autenticación
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        status: AUTH_STATES.AUTHENTICATED,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
        status: AUTH_STATES.UNAUTHENTICATED,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        status: AUTH_STATES.UNAUTHENTICATED,
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        error: null,
      };

    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Crear contexto
const AuthContext = createContext();

// Provider del contexto
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar autenticación al cargar la app
  useEffect(() => {
    const initializeAuth = async () => {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

      try {
        const token = authService.getToken();
        const user = authService.getCurrentUser();

        if (token && user) {
          // Verificar que el token sigue siendo válido
          const verifyResult = await authService.verifyToken();

          if (verifyResult.success) {
            dispatch({
              type: AUTH_ACTIONS.LOGIN_SUCCESS,
              payload: { user, token },
            });
          } else {
            // Token inválido, limpiar storage
            await authService.logout();
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
          }
        } else {
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } catch (error) {
        console.error("Error inicializando autenticación:", error);
        await authService.logout();
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }

      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    };

    initializeAuth();
  }, []);

  // Función de login
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

    try {
      const result = await authService.login(credentials);

      if (result.success) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: result.data.user,
            token: result.data.token,
          },
        });

        return { success: true, message: MESSAGES.LOGIN_SUCCESS };
      } else {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: result.error,
        });

        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error.message || MESSAGES.NETWORK_ERROR;

      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage,
      });

      return { success: false, error: errorMessage };
    }
  };

  // Función de logout
  const logout = async () => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

    try {
      await authService.logout();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });

      return { success: true, message: MESSAGES.LOGOUT_SUCCESS };
    } catch (error) {
      console.error("Error en logout:", error);
      // Aunque falle el logout en el servidor, limpiamos el estado local
      dispatch({ type: AUTH_ACTIONS.LOGOUT });

      return { success: true, message: MESSAGES.LOGOUT_SUCCESS };
    }
  };

  // Función para actualizar perfil
  const updateProfile = async () => {
    try {
      const result = await authService.getProfile();

      if (result.success) {
        dispatch({
          type: AUTH_ACTIONS.UPDATE_USER,
          payload: result.data,
        });

        return { success: true, data: result.data };
      } else {
        dispatch({
          type: AUTH_ACTIONS.SET_ERROR,
          payload: result.error,
        });

        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error.message || MESSAGES.NETWORK_ERROR;

      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });

      return { success: false, error: errorMessage };
    }
  };

  // Funciones de utilidad
  const hasRole = (role) => {
    return state.user?.rol === role;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(state.user?.rol);
  };

  const canAccessInstitution = (institucionId) => {
    // Super Admin Nacional puede acceder a todo
    if (state.user?.rol === "SUPER_ADMIN_NACIONAL") {
      return true;
    }

    // Otros usuarios solo a su institución
    return state.user?.institucionId === parseInt(institucionId);
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Valor del contexto
  const value = {
    // Estado
    ...state,

    // Acciones
    login,
    logout,
    updateProfile,
    clearError,

    // Utilidades
    hasRole,
    hasAnyRole,
    canAccessInstitution,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }

  return context;
};

export default AuthContext;
