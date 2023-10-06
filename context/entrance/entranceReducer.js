import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  LOAD_ENTRANCES_SUCESS,
  LOAD_ENTRANCES_ERROR,
  CLEAR_ENTRANCES,
  LOAD_ENTRANCES_MONTH_SUCESS,
  LOAD_ENTRANCES_MONTH_ERROR,
  LOAD_ENTRANCES_WEEK_SUCESS,
  LOAD_ENTRANCES_WEEK_ERROR,
} from '../../types';

export default (state, action) => {
  switch (action.type) {
    case LOAD_ENTRANCES_SUCESS:
      return {
        ...state,
        entrances: action.payload,
        loading: false,
      };
    case LOAD_ENTRANCES_ERROR:
      return {
        ...state,
        loading: false,
      };

    case LOAD_ENTRANCES_MONTH_SUCESS:
      return {
        ...state,
        entrancesMonth: action.payload,
        loading: false,
      };
    case LOAD_ENTRANCES_MONTH_ERROR:
      return {
        ...state,
        loading: false,
      };

    case LOAD_ENTRANCES_WEEK_SUCESS:
      return {
        ...state,
        entrancesWeek: action.payload,
        loading: false,
      };
    case LOAD_ENTRANCES_WEEK_ERROR:
      return {
        ...state,
        loading: false,
      };

    case CLEAR_ENTRANCES:
      return {
        entrances: null,
        entrancesMonth: [],
        entrancesWeek: [],
        loading: true,
      };
    /*
            case OBTENER_PROYECTOS: 
         return {
             ...state , 
             proyectos : action.payload
         } 
        case AGREGAR_PROYECTO: 
         return {
             ...state , 
             proyectos : [...state.proyectos , action.payload] ,
             formulario : false , 
             errorformulario : false 
        }

        case VALIDAR_FORMULARIO : {
            return {
                ...state , 
              errorformulario : true 
           }
   
        }

        case PROYECTO_ACTUAL : {
            return {
                ...state , 
                proyecto:state.proyectos.filter(proyecto => proyecto._id === action.payload)
           }
   
        }

        case ELIMINAR_PROYECTO : {
            return {
                ...state , 
                proyectos:state.proyectos.filter(proyecto => proyecto._id !== action.payload) , 
                proyecto:null 
           }
   
        }

        case PROYECTO_ERROR : { 
            return { 
                ...state , 
                mensaje : action.payload
            }
        } 
           */

    default:
      break;
  }
};
