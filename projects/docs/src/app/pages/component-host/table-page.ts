import { Component, signal } from '@angular/core';
import { Badge, Button, Table, TableColumn, TableRow, Tooltip } from '@laziar/components';
import { DocsSandboxValues } from '../../core/component-doc.model';
import { ComponentPage } from '../../shared/component-page/component-page';
import { DocsPreviewDirective } from '../../shared/component-page/docs-preview.directive';
import { docsBool, docsStr } from './docs-page.helpers';
import { TABLE_COMPONENT_META } from './table.meta';

type NewsDemoRow = TableRow & {
  id: number;
  cover: string;
  title: string;
  articleId: string;
  authorProfileName: string;
  authorExtra: number;
  categories: string;
  publishedAt: string;
  statusBadge: string;
  statusColor: 'green' | 'gray' | 'yellow';
};

const SAMPLE_ROWS: NewsDemoRow[] = [
  {
    id: 1,
    cover: 'https://picsum.photos/id/1015/128/96',
    title: 'Guvernul anunță un nou pachet de măsuri sociale',
    articleId: '104821',
    authorProfileName: 'Ana Pop',
    authorExtra: 2,
    categories: 'Politică, Economie',
    publishedAt: '19 aug 2026, 11:20',
    statusBadge: 'Publicat',
    statusColor: 'green',
  },
  {
    id: 2,
    cover: 'https://picsum.photos/id/1016/128/96',
    title: 'Parlamentul votează bugetul pe 2026',
    articleId: '104790',
    authorProfileName: 'Ion Rus',
    authorExtra: 0,
    categories: 'Politică',
    publishedAt: '18 aug 2026, 18:04',
    statusBadge: 'Draft',
    statusColor: 'gray',
  },
  {
    id: 3,
    cover: 'https://picsum.photos/id/1018/128/96',
    title: 'Primăria lansează licitația pentru transport public',
    articleId: '104755',
    authorProfileName: 'Maria Ionescu',
    authorExtra: 1,
    categories: 'Chișinău, Social',
    publishedAt: '17 aug 2026, 09:12',
    statusBadge: 'Publicat',
    statusColor: 'green',
  },
  {
    id: 4,
    cover: 'https://picsum.photos/id/1025/128/96',
    title: 'ANRE actualizează tarifele la energie',
    articleId: '104701',
    authorProfileName: 'Vlad Nistor',
    authorExtra: 0,
    categories: 'Economie, Energie',
    publishedAt: '16 aug 2026, 16:40',
    statusBadge: 'Review',
    statusColor: 'yellow',
  },
  {
    id: 5,
    cover: 'https://picsum.photos/id/1035/128/96',
    title: 'Ministerul Educației publică rezultatele examenelor',
    articleId: '104688',
    authorProfileName: 'Elena Duca',
    authorExtra: 0,
    categories: 'Educație',
    publishedAt: '15 aug 2026, 13:05',
    statusBadge: 'Publicat',
    statusColor: 'green',
  },
  {
    id: 6,
    cover: 'https://picsum.photos/id/1040/128/96',
    title: 'Consiliul decide renovarea stadionului',
    articleId: '104640',
    authorProfileName: 'Ana Pop',
    authorExtra: 0,
    categories: 'Sport',
    publishedAt: '14 aug 2026, 10:18',
    statusBadge: 'Draft',
    statusColor: 'gray',
  },
  {
    id: 7,
    cover: 'https://picsum.photos/id/1043/128/96',
    title: 'Banca Națională menține rata de bază',
    articleId: '104612',
    authorProfileName: 'Ion Rus',
    authorExtra: 3,
    categories: 'Economie',
    publishedAt: '13 aug 2026, 12:00',
    statusBadge: 'Publicat',
    statusColor: 'green',
  },
  {
    id: 8,
    cover: 'https://picsum.photos/id/1050/128/96',
    title: 'Avertizare meteo pentru weekend',
    articleId: '104580',
    authorProfileName: 'Maria Ionescu',
    authorExtra: 0,
    categories: 'Meteo',
    publishedAt: '12 aug 2026, 07:45',
    statusBadge: 'Publicat',
    statusColor: 'green',
  },
  {
    id: 9,
    cover: 'https://picsum.photos/id/1060/128/96',
    title: 'Noul regulament pentru publicitate politică',
    articleId: '104533',
    authorProfileName: 'Vlad Nistor',
    authorExtra: 1,
    categories: 'Politică, Media',
    publishedAt: '11 aug 2026, 15:22',
    statusBadge: 'Review',
    statusColor: 'yellow',
  },
  {
    id: 10,
    cover: 'https://picsum.photos/id/1062/128/96',
    title: 'Interviu cu ministrul sănătății',
    articleId: '104501',
    authorProfileName: 'Elena Duca',
    authorExtra: 0,
    categories: 'Sănătate',
    publishedAt: '10 aug 2026, 19:30',
    statusBadge: 'Draft',
    statusColor: 'gray',
  },
  {
    id: 11,
    cover: 'https://picsum.photos/id/1074/128/96',
    title: 'Proiectul de lege trece de comisie',
    articleId: '104477',
    authorProfileName: 'Ana Pop',
    authorExtra: 0,
    categories: 'Politică',
    publishedAt: '9 aug 2026, 08:50',
    statusBadge: 'Publicat',
    statusColor: 'green',
  },
  {
    id: 12,
    cover: 'https://picsum.photos/id/1084/128/96',
    title: 'Raport trimestrial de audiență',
    articleId: '104420',
    authorProfileName: 'Ion Rus',
    authorExtra: 0,
    categories: 'Media',
    publishedAt: '8 aug 2026, 14:11',
    statusBadge: 'Publicat',
    statusColor: 'green',
  },
];

@Component({
  selector: 'docs-table-page',
  standalone: true,
  imports: [ComponentPage, DocsPreviewDirective, Table, Badge, Button, Tooltip],
  templateUrl: './table-page.html',
  styleUrl: './table-page.scss',
})
export class TablePage {
  protected readonly meta = TABLE_COMPONENT_META;
  protected readonly page = signal(1);
  protected readonly pageSize = signal(10);

  protected readonly columns: TableColumn[] = [
    { key: 'cover', header: 'Imagine', width: 'w-[92px]', minWidth: 'min-w-[92px]' },
    { key: 'title', header: 'Titlu', width: 'w-[260px]', minWidth: 'min-w-[260px]' },
    { key: 'articleId', header: 'ID', width: 'w-[120px]', minWidth: 'min-w-[120px]' },
    { key: 'authorProfileName', header: 'Autor', width: 'w-[120px]', minWidth: 'min-w-[120px]' },
    { key: 'categories', header: 'Categorii', width: 'w-[220px]', minWidth: 'min-w-[220px]' },
    {
      key: 'publishedAt',
      header: 'Data publicării',
      width: 'w-[172px]',
      minWidth: 'min-w-[172px]',
    },
    { key: 'statusBadge', header: 'Statut', width: 'w-[120px]', minWidth: 'min-w-[120px]' },
    {
      key: 'actions',
      header: '',
      width: 'w-12',
      minWidth: 'min-w-12',
      align: 'right',
      sticky: true,
      stickyPosition: 'right',
    },
  ];

  protected str(values: DocsSandboxValues, key: string, fallback = ''): string {
    return docsStr(values, key, fallback);
  }

  protected bool(values: DocsSandboxValues, key: string, fallback = false): boolean {
    if (!(key in values)) return fallback;
    return docsBool(values, key);
  }

  protected rows(values: DocsSandboxValues): TableRow[] {
    if (this.bool(values, 'empty')) return [];
    const size = this.pageSize();
    const start = (this.page() - 1) * size;
    return SAMPLE_ROWS.slice(start, start + size);
  }

  protected total(values: DocsSandboxValues): number {
    return this.bool(values, 'empty') ? 0 : SAMPLE_ROWS.length;
  }

  protected asNews(row: TableRow): NewsDemoRow {
    return row as NewsDemoRow;
  }

  protected onPageChange(page: number): void {
    this.page.set(page);
  }

  protected onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.page.set(1);
  }

  protected stopRowClick(event: Event): void {
    event.stopPropagation();
  }
}
