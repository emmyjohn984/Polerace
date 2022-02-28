// @Pipe({ name: 'orderBy' })
// export class MyOrderByPipe implements PipeTransform {
//   transform(categoryName: any[], field: string, reverse: boolean = false): any[] {
//     if (!categoryName) return [];

//     if (categoryName) categoryName.sort((a, b) => a[field] > b[field] ? 1 : -1);
//     else categoryName.sort((a, b) => a > b ? 1 : -1);

//     if (reverse) categoryName.reverse();

//     return categoryName;
//   }
// }

import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'orderBy',pure: true})

export class OrderByPipe implements PipeTransform {

  transform(value: any[], propertyName: string): any[] {
    if (propertyName)
      return value.sort((a: any, b: any) => a[propertyName].localeCompare(b[propertyName]));
    else
      return value;
  }

}
