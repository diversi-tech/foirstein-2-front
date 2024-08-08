
import axios from "axios";
  const urlService = "https://localhost:7118/api/BorrowRequest/"
 // const urlService = "process.env.REACT_APP_SERVER_URL/api/BorrowRequest/"

export const AddBorrowRequest = async (borrowRequest) => {
    try
    {debugger
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
export const GetBorrowRequestsAndApprovalsByItemId = async (ItemId) => {
    try
    {
        ItemId=2;
        let data = await axios.get(`${urlService}GetBorrowRequestsAndApprovalsByItemId/${ItemId}`)
        if (data)
        {
            return data.data
        }
    }
    catch (e)
    {
        console.log(e)
    }
}
