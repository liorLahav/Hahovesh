// app/index.tsx
import { Redirect } from "expo-router";
import { useUserContext } from "@/hooks/UserContext";
import Loading from "@/components/Loading";



export default function Index() {
  const {isAuthenticated,userLoading} = useUserContext();

  if (userLoading) 
    return <Loading/>
  console.log("Redirecting to", isAuthenticated);
  return <Redirect href={isAuthenticated ? "/home" : "/login"} />;
}
