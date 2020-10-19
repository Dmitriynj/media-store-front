import { useHistory } from "react-router-dom";
import { useGlobals } from "./GlobalContext";

const useErrors = () => {
  const history = useHistory();
  const { setError } = useGlobals();

  const handleError = (error) => {
    console.error("Error", error);
    if (error.response) {
      setError({
        status: error.response.status,
        statusText: error.response.statusText,
        message: error.response.data.error.message,
      });
    } else {
      setError({
        status: "",
        statusText: "Network error",
        message: "Please, check your connection",
      });
    }

    history.push("/error");
  };

  return {
    handleError,
  };
};

export { useErrors };
