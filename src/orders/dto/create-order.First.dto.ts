import { IsBoolean, IsDate, isDate, IsEnum, IsNumber, IsOptional, IsPositive } from "class-validator";
import { OrderStatus,OrderStatusList } from "../enum/order.enum";

export class CreateOrderDto {

    @IsNumber()
    @IsPositive()
    totoalAmount : number;

    @IsNumber()
    @IsPositive()
    totalItems: number;

    @IsEnum(OrderStatusList,{
        message: `Posible status values are ${OrderStatusList}`
    })
    @IsOptional()
    status : OrderStatus = OrderStatus.PENDING;

    @IsBoolean()
    @IsOptional()
    paid : boolean = false;
}