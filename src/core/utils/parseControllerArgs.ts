import { Request } from "express";
import { ControllerArgs } from "../types";

class ParseControllerArgs {
  parse = (req: Request): ControllerArgs<any> => {
    return {
      input: req.body,
      params: req.params,
      query: req.query,
      headers: req.headers,
      user: req.user,
      files: "" as any,
      cookies:req.cookies
    };
  };
}

export default new ParseControllerArgs();
