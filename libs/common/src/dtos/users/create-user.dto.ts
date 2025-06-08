// libs/common/src/dtos/users/create-user.dto.ts

import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
    MinLength,
    Validate,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

/**
 * A custom validator to check if two properties match.
 * This is a reusable constraint.
 */
@ValidatorConstraint({ name: 'Match', async: false })
export class MatchConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        const [relatedPropertyName] = args.constraints;
        const relatedValue = (args.object as any)[relatedPropertyName];
        return value === relatedValue;
    }

    defaultMessage(args: ValidationArguments) {
        const [relatedPropertyName] = args.constraints;
        // e.g., "password and passwordConfirm must match."
        return `${args.property} and ${relatedPropertyName} must match.`;
    }
}

/**
 * A stricter and more professional DTO for creating a new user.
 */
export class CreateUserDto {
    @IsEmail({}, { message: 'Please provide a valid email address.' })
    @IsNotEmpty({ message: 'Email cannot be empty.' })
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'Password must be at least 8 characters long.' })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
            message:
                'Password is too weak. It must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).',
        },
    )
    password: string;

    @IsString()
    @IsNotEmpty({ message: 'Please confirm your password.' })
    @Validate(MatchConstraint, ['password'], {
        // Use our custom Match decorator
        message: 'Passwords do not match.',
    })
    passwordConfirm: string;
}
