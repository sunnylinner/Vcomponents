import Mock from 'mockjs';

const dataTemplate = [];
for (let i = 0; i < 6; i += 1) {
  dataTemplate.push({
    'timestamp|+2': 1583371760000,
    value: () => (1 + Math.random()).toFixed(2),
    type: `type${i}`,
  });
}

export default Mock.mock({ 'list|20-30': dataTemplate }).list;
