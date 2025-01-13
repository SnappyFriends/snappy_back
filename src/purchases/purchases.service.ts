import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import {
  PaymentMethod,
  PaymentStatus,
  Purchase_Log,
} from './entities/purchase_log.entity';
import { User, userType } from 'src/users/entities/user.entity';
import { NodemailerService } from 'src/nodemailer/nodemailer.service';
import { subscriptionRangeDTO } from './dto/purchases.dto';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase_Log)
    private readonly purchaseRepository: Repository<Purchase_Log>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly nodemailerService: NodemailerService
  ) { }

  async createInitialPurchase(
    userId: string,
    amount: number,
    sessionId: string,
  ) {
    const user = await this.usersRepository.findOne({
      where: { id: userId }
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

    const savedPurchase = this.purchaseRepository.save(purchase);

    const emailSubject = '¡Gracias por tu suscripción Premium!';
    const emailText = `Hola ${user.fullname}, gracias por adquirir el paquete premium.`;
    const emailHtml = `<div style="text-align: center;"> 
      <img src="https://snappyfriends.vercel.app/_next/image?url=%2Ffavicon.ico&w=64&q=75" alt="Logo" style="display: block; margin: 0 auto; width: 150px; height: auto;">
      <h1> ¡Ahora eres Premium, ${user.fullname}!</h1>
      Hola ${user.fullname}, gracias por suscribirte a Premium en snappyFriends. Tu suscripción esta activa y ya puedes disfrutar de los beneficios que te ofrecemos en paquete premium.
      </div>
  `;

    await this.nodemailerService.sendEmail(
      user.email,
      emailSubject,
      emailText,
      emailHtml
    );

    return savedPurchase;

  }

  async getSubscriptionByUser(userId) {
    const subscriptionFound = await this.purchaseRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user']
    });
    if (!subscriptionFound) throw new NotFoundException("Subscription not found");

    return subscriptionFound;
  }

  async getSubscriptions() {
    return await this.purchaseRepository.find({ relations: ['user'] });
  }

  async getSubscriptionsRange(subscriptionRange: subscriptionRangeDTO) {
    const { startDate, endDate } = subscriptionRange;
    const start = new Date(startDate);
    const end = new Date(endDate);

    const subscriptions = await this.purchaseRepository.find({
      where: {
        purchase_date: Between(start, end)
      },
      relations: ['user'],
      select: {
        user: {
          id: true,
          username: true,
          fullname: true,
          profile_image: true
        }
      }
    })

    const totalAmount = subscriptions.reduce((total, subscription) => total + subscription.amount, 0)

    return {
      subscriptions,
      totalAmount
    }
  }
}
