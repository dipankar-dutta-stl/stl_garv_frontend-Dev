import { Map } from "./doc-map";
import { HealthData } from "./health-data";
import { Prescription } from "./prescription";
import { User } from "./user";

export class Case {
        case_id?: number;
        case_number?: number;
        patient_id?: number;
        vle_id?: number;
        panchayat_id?: number;
        vle_note?: string;
        case_status?: string;
        case_date?: string;
        ref_image?: string;
        description?: string;
        created_date?: string;
        updated_date?: string;
        patient?: User;
        vle?: User;
        has_health_data?: HealthData;
        prescription?: Prescription[];
        case?: Map
}