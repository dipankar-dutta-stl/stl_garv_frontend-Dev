import { Case } from "./case";
import { User } from "./user";

export class Prescription {
        prescription_id?: number;
        case_id?: number;
        patient_id?: number;
        doctor_id?: number;
        prescription_image?: string;
        note?: string;
        next_visit_date?: string;
        created_date?: string;
        updated_date?: string;
        doctor?: User;
        patient?: User;
        case?: Case 
}