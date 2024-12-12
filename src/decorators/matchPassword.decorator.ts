import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: "MatchPassword", async: false })
export class MatchPassword implements ValidatorConstraintInterface {
    validate(password: string, args: ValidationArguments) {
        if(password !== (args.object)[args.constraints[0]]) return false;
        return true;
    }

    defaultMessage(): string {
        return "Las contraseñas no coinciden"
    }
}