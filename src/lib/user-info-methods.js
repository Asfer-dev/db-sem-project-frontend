export const getUserInfo = () => {
  const user = {
    email: "",
    name: "",
    cnic: "",
    contact_no: "",
    gender: "",
    user_id: "",
  };
  user.user_id = sessionStorage.getItem("user_id");
  user.email = sessionStorage.getItem("email");
  user.name = sessionStorage.getItem("name");
  user.cnic = sessionStorage.getItem("cnic");
  user.contact_no = sessionStorage.getItem("contact_no");
  user.gender = sessionStorage.getItem("gender");

  return user;
};

export const removeUserInfo = () => {
  sessionStorage.removeItem("user_id");
  sessionStorage.removeItem("email");
  sessionStorage.removeItem("name");
  sessionStorage.removeItem("cnic");
  sessionStorage.removeItem("contact_no");
  sessionStorage.removeItem("gender");
};

export const setUserInfo = (userAcc) => {
  sessionStorage.setItem("user_id", userAcc.user._id);
  sessionStorage.setItem("email", userAcc.email);
  sessionStorage.setItem("name", userAcc.user.name);
  sessionStorage.setItem("cnic", userAcc.user.cnic);
  sessionStorage.setItem("contact_no", userAcc.user.contact_no);
  sessionStorage.setItem("gender", userAcc.user.gender);
};
