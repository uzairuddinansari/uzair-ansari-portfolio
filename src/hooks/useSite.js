import { useContext } from "react";
import SiteContext from "../context/SiteContext";

export default function useSite() {
  return useContext(SiteContext);
}
