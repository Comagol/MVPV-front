/* Match interface */

//Importo player
import type { Player } from './player';

export interface Match {
  _id: string;
  fecha: string;
  rival: string;
  estado: 'programado' | 'en_proceso' | 'finalizado';
  jugadores: Player[];
  ganador?: Player;
  description?: string;
}