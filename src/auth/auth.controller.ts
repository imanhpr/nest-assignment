import { Controller, Body, Post, HttpCode } from "@nestjs/common";
import { UserDTO } from "./DTO/User.DTO.js";
import AuthService from "./auth.service.js";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post("register")
  createNewUser(@Body() createUserDTO: UserDTO) {
    return this.authService.createNewUser(createUserDTO);
  }

  @Post("login")
  @HttpCode(200)
  getAcessToken(@Body() loginUserDTO: UserDTO) {
    return this.authService.login(loginUserDTO);
  }
}
