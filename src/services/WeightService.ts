import axios from "axios";
import {WeightEntry} from "../models/weight-entry";

class WeightService {
    public getEntries() {
        return axios.get("/weight-tracker/server/get_weight_entries.php");
    }

    public addEntry(entry: WeightEntry) {
        return axios.post("/weight-tracker/server/add_weight_entry.php", entry);
    }
}

export default new WeightService();