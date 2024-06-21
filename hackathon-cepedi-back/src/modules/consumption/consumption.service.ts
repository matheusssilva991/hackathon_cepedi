import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { ILike, Repository } from 'typeorm';
import { AddressService } from './../address/address.service';
import { ConsumptionQueryDto } from './dto/consumption-query.dto';
import { CreateConsumptionDto } from './dto/create-consumption.dto';
import { UpdateConsumptionDto } from './dto/update-consumption.dto';
import { Consumption } from './entities/consumption.entity';

@Injectable()
export class ConsumptionService {
  constructor(
    @InjectRepository(Consumption)
    private consumptionRepository: Repository<Consumption>,
    private readonly addressService: AddressService,
  ) {}

  async create(createConsumptionDto: CreateConsumptionDto) {
    // Verifica se o endereço existe
    const addressId = createConsumptionDto.addressId;
    await this.addressService.findOne(addressId);

    const consumption =
      await this.consumptionRepository.save(createConsumptionDto);

    try {
      const response: any = await axios.patch(
        `http://localhost:8000/api/consumption/${addressId}`,
      );
      return response.data;
    } catch (error) {
      return consumption;
    }
  }

  async findAll() {
    return await this.consumptionRepository.find();
  }

  async findAllWithQuery(query: ConsumptionQueryDto) {
    const filter = {
      ...(query.year && { year: query.year }),
      ...(query.month && { month: query.month }),
      ...(query.day && { day: ILike(`%${query.day}%`) }),
      ...(query.hour && { hour: query.hour }),
      ...(query.consumption && { consumption: query.consumption }),
      ...(query.pattern && { pattern: ILike(`%${query.pattern}%`) }),
      ...(query.address && { addressId: query.address }),
    };

    // Ordenação
    let sortObject: any;
    try {
      sortObject = JSON.parse(query.sort);
    } catch (error) {
      sortObject = { id: 'ASC' };
    }

    return await this.consumptionRepository.find({
      where: filter,
      order: sortObject,
      take: query.limit || undefined,
      skip: (query.page - 1) * query.limit || 0,
    });
  }

  async findOne(id: number) {
    try {
      return await this.consumptionRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException('Consumo não encontrado.');
    }
  }

  async update(id: number, updateConsumptionDto: UpdateConsumptionDto) {
    await this.findOne(id);

    // Verifica se o endereço existe
    if (updateConsumptionDto.addressId) {
      await this.addressService.findOne(updateConsumptionDto.addressId);
    }

    return await this.consumptionRepository.update(id, updateConsumptionDto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.consumptionRepository.delete(id);
  }
}
