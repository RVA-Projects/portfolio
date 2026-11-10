import type { Project } from '../../models/Project'
import { centroMedicoSectorV } from './centro-medico-sector-v'
import { dawdamTop } from './dawdam-top'
import { flashcardsApp } from './flashcards-app'
import { gbUtility } from './gb-utility'
import { lokiHome } from './loki-home'
import { miniCrm } from './mini-crm'
import { snake } from './snake'
import { signatureApplication } from './signature-application'
import { taskManager } from './task-manager'

/** Catálogo declarativo de proyectos (RF-09). Orden: más protagonistas primero. */
export const projects: Project[] = [
  signatureApplication,
  centroMedicoSectorV,
  lokiHome,
  taskManager,
  gbUtility,
  flashcardsApp,
  miniCrm,
  dawdamTop,
  snake,
]
