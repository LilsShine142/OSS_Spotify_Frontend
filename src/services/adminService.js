import axios from "axios";

export const fetchUsers = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const token = userData?.token;

      if (token) {
        const res = await axios.get('http://127.0.0.1:8000/user_management/getallusers/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return res.data
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };


export const updateStatus = async(id , newIsHidden) => {
  try {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const token = userData?.token;
    
    const res = await axios.patch(
      `http://127.0.0.1:8000/user_management/users/${id}/is_hidden/`,
      { isHidden: newIsHidden },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {"success" :res.data.success , "message" : res.data.message , "err" : res.data.error}
  } catch (error) {
    
  }

}