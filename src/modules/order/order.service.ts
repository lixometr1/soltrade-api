import { MagicEdenService } from './../magic-eden/magic-eden.service';
import { Order, OrderDocument } from './entities/order.entity';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EventEmitter2 } from 'eventemitter2';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @Inject(forwardRef(() => MagicEdenService))
    private magicEdenService: MagicEdenService,
    private eventEmiter: EventEmitter2,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    const item = new this.orderModel(createOrderDto);
    this.magicEdenService.trackStartOrder(createOrderDto.collectionName);
    this.eventEmiter.emit('order:create');
    return item.save();
  }

  findAll() {
    return this.orderModel.find();
  }

  findOne(id: string) {
    return this.orderModel.findOne({ _id: id });
  }
  async findByCollection(collectionName: string) {
    const item = await this.orderModel.findOne({
      collectionName,
      type: 'magiceden',
      done: { $ne: true },
    });
    return item;
  }
  async findNotDone() {
    const items = await this.orderModel.find({
      type: 'magiceden',
      done: { $ne: true },
    });
    return items;
  }
  async fullfillOrder(id: string) {
    return this.orderModel.updateOne({ _id: id }, { done: true });
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return this.orderModel.updateOne({ _id: id }, updateOrderDto);
  }

  async remove(id: string) {
    const item = await this.orderModel.findOne({ _id: id });
    this.magicEdenService.trackStop(item.collectionName);
    return this.orderModel.deleteOne({ _id: id });
  }
}
