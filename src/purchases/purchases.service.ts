import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PaymentMethod, PaymentStatus, Purchase_Log } from "./entities/purchase_log.entity";
import { User, userType } from "src/users/entities/user.entity";

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase_Log)
    private readonly purchaseRepository: Repository<Purchase_Log>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) { }

  async createInitialPurchase(userId: string, amount: number, sessionId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('El usuario no existe');
    }

    user.user_type = userType.PREMIUM;

    await this.usersRepository.save(user);

    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 30);

    const purchase = this.purchaseRepository.create({
      user,
      amount,
      purchase_date: new Date(),
      expiration_date: expireDate,
      payment_method: PaymentMethod.CARD,
      status: PaymentStatus.COMPLETED,
      stripe_session_id: sessionId,
    });

    return this.purchaseRepository.save(purchase);
  }
}
