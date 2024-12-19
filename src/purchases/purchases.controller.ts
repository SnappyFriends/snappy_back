import { Controller, Post, Param, ParseUUIDPipe } from "@nestjs/common";
import { StripeService } from "./stripe.service";
import { PurchasesService } from "./purchases.service";

@Controller('purchases')
export class PurchasesController {
    constructor(
        private readonly stripeService: StripeService,
        private readonly purchasesService: PurchasesService,
    ) {}

    @Post('subscribe/:id')
    async createSubscription(@Param('id', ParseUUIDPipe) userId: string ) {
        const amount = 10;

        const session = await this.stripeService.createCheckoutSession(amount, userId);

        await this.purchasesService.createInitialPurchase(userId, amount, session.id);

        return { url: session.url };
    }
}
