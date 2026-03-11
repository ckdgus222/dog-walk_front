import { redirect } from "next/navigation";
import { ROUTES } from "@/routes";

const Home = () => {
  redirect(ROUTES.MAP);
};

export default Home;
