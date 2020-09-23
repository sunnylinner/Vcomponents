import Mock from 'mockjs';

const dataTemplate = [];
for (let i = 0; i < 6; i += 1) {
  dataTemplate.push({
    'timestamp|+2': 1583371760000,
    value: () => (4 + Math.random()).toFixed(2),
    type: `type${i}`,
  });
}

const GetData = Mock.mock({ 'list|300-300': dataTemplate }).list;
const AddData = Mock.mock({
  'list|300-300': [{
    'timestamp|+2': 1583371760000,
    value: () => (4 + Math.random()).toFixed(2),
    type: 'type6',
  }],
}).list;

export {
  GetData, AddData,
};
