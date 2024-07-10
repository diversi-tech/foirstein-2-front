
import axios from "axios";
const urlService = "https://localhost:7118/api/BorrowRequest/"
export const AddBorrowRequest = async (borrowRequest) => {
    try
    {
        let data = await axios.post(`${urlService}AddBorrowRequest`,borrowRequest)
        if (data)
        {
            console.log(data);
        }
    }
    catch (e)
    {
        console.log(e)
    }
}