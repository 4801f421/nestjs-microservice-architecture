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

// First, we create a custom decorator to check if two fields match.
@ValidatorConstraint({ name: 'Match' })
export class MatchConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        const [relatedPropertyName] = args.constraints;
        const relatedValue = (args.object as any)[relatedPropertyName];
        return value === relatedValue;
    }

    defaultMessage(args: ValidationArguments) {
        const [relatedPropertyName] = args.constraints;
        return `${args.property} and ${relatedPropertyName} must match.`;
    }
}

/**
 * A stricter and more professional DTO for user sign-up.
 */
export class SignUpDto {
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
                'Password is too weak. It must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        },
    )
    password: string;

    @IsString({ message: 'Password confirmation must be a string.' })
    @IsNotEmpty({ message: 'Please confirm your password.' })
    @Validate(MatchConstraint, ['password'], {
        // Use the custom Match decorator
        message: 'Passwords do not match.',
    })
    passwordConfirm: string;
}

/**
 * Data Transfer Object for user login with custom error messages.
 */
export class LoginDto {
    @IsEmail({}, { message: 'Please provide a valid email address.' })
    @IsNotEmpty({ message: 'Email cannot be empty.' })
    email: string;

    @IsString({ message: 'Password must be a string.' })
    @IsNotEmpty({ message: 'Password cannot be empty.' })
    password: string;
}
