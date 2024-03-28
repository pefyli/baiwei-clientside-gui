export enum ErrorMsg {
  Error = "錯誤",
  Unauthorized = "帳號或密碼錯誤",
  NotFound = "帳號不存在",
  Unexpected = "未知錯誤",
}

export function ErrorStrToEum(errorMessage: string): ErrorMsg {
  if (errorMessage === "Unauthorized") {
    return ErrorMsg.Unauthorized;
  } else if (errorMessage === "Member not found") {
    return ErrorMsg.NotFound;
  } else {
    return ErrorMsg.Unexpected;
  }
}
