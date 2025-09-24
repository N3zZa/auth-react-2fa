import type { AxiosError } from "axios";

export type ResponseErrorType = AxiosError & {response: {data: {error?: string}}}