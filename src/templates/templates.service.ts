import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { templates as predefinedTemplates } from './data/templates.data';

@Injectable()
export class TemplatesService {
  constructor(private prisma: PrismaService) {}

  async getAllTemplates() {
    const dbTemplates = await this.prisma.template.findMany({
      select: { id: true, title: true, createdBy: true },
    });

    const predefs = Object.entries(predefinedTemplates).map(([id, tpl]) => ({
      id,
      title: tpl.title,
      isCustom: false,
    }));

    const customs = dbTemplates.map((tpl) => ({
      id: tpl.id,
      title: tpl.title,
      isCustom: true,
    }));

    return [...predefs, ...customs];
  }

  async getTemplateById(id: string) {
    if (predefinedTemplates[id]) {
      return { id, ...predefinedTemplates[id], isCustom: false };
    }

    const dbTemplate = await this.prisma.template.findUnique({
      where: { id },
    });
    if (!dbTemplate) throw new NotFoundException(`Template '${id}' not found`);

    return { ...dbTemplate, isCustom: true };
  }

  async createCustomTemplate(userId: string, title: string, blocks: any[]) {
    return this.prisma.template.create({
      data: {
        title,
        blocks,
        createdBy: Number(userId),
      },
    });
  }

  async updateCustomTemplate(
    userId: string,
    templateId: string,
    title: string,
    blocks: any[],
  ) {
    const template = await this.prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      throw new NotFoundException(`Template '${templateId}' not found`);
    }

    if (template.createdBy !== Number(userId)) {
      throw new Error('You are not allowed to edit this template');
    }

    return this.prisma.template.update({
      where: { id: templateId },
      data: {
        title,
        blocks,
      },
    });
  }
}
