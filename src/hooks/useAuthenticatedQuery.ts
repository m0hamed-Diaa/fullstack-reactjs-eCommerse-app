import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../config/axios.config";
import type { AxiosRequestConfig } from "axios";

interface IAuthenticatedQuery {
  url: string;
  queryKey: string[];
  config?: AxiosRequestConfig;
  retry?: boolean;
  staleTime?: number;
}

const useCustomQuery = ({url, queryKey, config} : IAuthenticatedQuery) => {

  return useQuery({
    queryKey,
    queryFn: async () => {
    const {data} = await axiosInstance.get(url, config)
    return data;
    }
  })
}

export default useCustomQuery;