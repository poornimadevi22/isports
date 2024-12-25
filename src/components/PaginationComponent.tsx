import React from 'react';
import { Box, Typography, Select, MenuItem, Pagination, PaginationItem } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import EastIcon from '@mui/icons-material/East';

const PaginationComponent: React.FC<{
  rowsPerPage: number;
  handleChangeRowsPerPage: any;
  page: number;
  handleChangePage: (event: React.ChangeEvent<unknown>, page: number) => void;
  startIndex: number;
  endIndex: number;
  totalItems: number; // Add total items for pagination
  isDisable?:boolean
}> = ({ 
  rowsPerPage, 
  page, 
  handleChangePage, 
  startIndex, 
  endIndex, 
  totalItems, 
  handleChangeRowsPerPage ,
  isDisable
}) => {
  const totalPages = Math.ceil(totalItems / rowsPerPage);
console.log({totalItems},'======');

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" px="5px" py="8px">
      {/* Items per page dropdown */}
      <Box display="flex" alignItems="center" marginLeft="10px">
        <Typography 
          sx={{
            display: 'inline', 
            marginRight: '20px', 
            fontFamily: '29LT Bukra', 
            fontWeight: 500, 
            fontSize: '14px', 
            lineHeight: '24px', 
            color: '#888888' 
          }}
        >
          Items per page:
        </Typography>
        <Select
        disabled={totalItems < 10 || isDisable}
          value={rowsPerPage}
          onChange={handleChangeRowsPerPage}
          size="small"
          sx={{ width: '60px', maxHeight: '30px' }}
          IconComponent={() => <ExpandMoreIcon style={{ marginLeft: '-15px' }} />}
          renderValue={(selected) => (
            <Typography 
              sx={{
                fontFamily: '29LT Bukra', 
                fontWeight: 500, 
                fontSize: '14px', 
                lineHeight: '24px', 
                color: '#888888' 
              }}
            >
              {selected}
            </Typography>
          )}
        >
          {[5, 10, 15, 20].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>

        <Typography 
          sx={{
            display: 'inline', 
            marginLeft: '8px', 
            marginRight: '8px', 
            fontFamily: '29LT Bukra', 
            fontWeight: 500, 
            fontSize: '14px', 
            lineHeight: '24px', 
            color: '#888888' 
          }}
        >
          Total
        </Typography>
        <Box
          sx={{
            borderLeft: "2px solid #DEE2ED",
            height: "45px",
            alignSelf: "center",
            marginLeft: '2px',
            marginRight: '8px',
          }}
        />
        <Typography 
          sx={{
            display: 'inline', 
            marginRight: '8px', 
            fontFamily: '29LT Bukra', 
            fontWeight: 500, 
            fontSize: '14px', 
            lineHeight: '24px', 
            color: '#888888' 
          }}
        >
           Showing {startIndex}-{endIndex} of {totalItems} total
        </Typography>
      </Box>
      {/* Pagination controls */}
      <Pagination
        count={totalPages}
        page={page === 0 ? 1 : page}
        onChange={(event, value) => handleChangePage(event, value)}
        variant="outlined"
        shape="rounded"
        disabled={isDisable}
        renderItem={(item) => (
          <PaginationItem
            {...item}
            sx={{
              '&.Mui-selected': {
                backgroundColor: '#008755',
                color: 'white',
              },
              '&:not(.Mui-selected)': {
                backgroundColor: 'white',
                color: '#008755',
              },
              border: '1px solid #008755',
              width: '28px',
              height: '28px',
            }}
            components={{
              previous: () => <KeyboardBackspaceIcon sx={{ fontSize: 20 }} />,
              next: () => <EastIcon sx={{ fontSize: 20 }} />,
            }}
          />
        )}
      />
    </Box>
  );
};

export default PaginationComponent;
