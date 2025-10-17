import { IsEthereumAddress, IsHexadecimal, IsOptional, IsString, Length } from "class-validator";

export class CreateDonationDto {
    @IsString()
    @IsHexadecimal()
    @Length(66, 66)
    txHash!: string;

    @IsEthereumAddress()
    wallet!: string;

    @IsOptional()
    @IsString()
    email?: string;
}
