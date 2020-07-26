import React from 'react';
import TableVirtualized from '../../table/virtualized/TableVirtualized';
const SimpleTable =(props)=>
{
    const {
        
    }
    return(
        <TableVirtualized
         
            {...{
              tableData,
              tableHeader,
              cellSpecs,
              formData,
              validationSchema,
              onHeaderClicked,
              sortByColumn,
              updateFieldData,
            }}
            showCircularIndicator={isNextPageLoading}
            rowCount={tableData.length}
            rowGetter={({ index }) => tableData[index]}
            columns={tableHeader.map((el) => ({
              ...el,
              dataKey: el.key,
              width: columnsWidth[el.key] != null ? columnsWidth[el.key] : 100,
            }))}
          />
    )
}