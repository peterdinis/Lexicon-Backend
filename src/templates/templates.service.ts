import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { templates as predefinedTemplates } from './templates.data';

@Injectable()
export class TemplatesService {
  constructor(private prisma: PrismaService) {}

  // Return combined list of template metadata
  async getAllTemplates() {
    // Get DB templates metadata
    const dbTemplates = await this.prisma.template.findMany({
      select: { id: true, title: true, createdBy: true },
    });

    // Map predefined templates metadata
    const predefs = Object.entries(predefinedTemplates).map(([id, tpl]) => ({
      id,
      title: tpl.title,
      isCustom: false,
    }));

    // Map DB templates metadata
    const customs = dbTemplates.map((tpl) => ({
      id: tpl.id,
      title: tpl.title,
      isCustom: true,
    }));

    return [...predefs, ...customs];
  }

  // Get template details by ID, check predefined first
  async getTemplateById(id: string) {
    // If matches predefined
    if (predefinedTemplates[id]) {
      return { id, ...predefinedTemplates[id], isCustom: false };
    }

    // Else look in DB
    const dbTemplate = await this.prisma.template.findUnique({
      where: { id },
    });
    if (!dbTemplate) throw new NotFoundException(`Template '${id}' not found`);

    return { ...dbTemplate, isCustom: true };
  }

  // Create new custom template
  async createCustomTemplate(userId: string, title: string, blocks: any[]) {
    return this.prisma.template.create({
      data: {
        title,
        blocks,
        createdBy: userId,
      },
    });
  }
}