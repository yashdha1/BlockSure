const Insurance = artifacts.require('Insurance');

contract('Insurance', (accounts) => {
  it('should deploy successfully', async () => {
    const instance = await Insurance.deployed();
    assert.ok(instance.address);
  });
});