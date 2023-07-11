import { Case } from "./case";
import { User } from "./user";

export class Map {
        mapping_id?: number;
        case_id?: number;
        doctor_id?: number;
        rejected_by_id?: number;
        approved_by_id?: number;
        assigned_by_id?: number;
        reason?: string;
        mapping_status?: string;
        created_date?: string;
        updated_date?: string;
        case?: Case;
        doctor?: User
}