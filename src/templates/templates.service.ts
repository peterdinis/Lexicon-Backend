import { Injectable, NotFoundException } from '@nestjs/common';
import { templates } from './templates.data';

@Injectable()
export class TemplatesService {
  getAllTemplates() {
    return Object.entries(templates).map(([id, tpl]) => ({
      id,
      title: tpl.title,
    }));
  }

  getTemplateById(id: string) {
    const template = templates[id];
    if (!template) throw new NotFoundException(`Template '${id}' not found`);
    return { id, ...template };
  }
}
