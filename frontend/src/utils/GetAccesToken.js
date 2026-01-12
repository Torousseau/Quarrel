export const getAccessToken = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    return userData?.access || null;
};