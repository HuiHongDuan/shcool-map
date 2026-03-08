import { test, expect } from '@playwright/test';

test('首页地图成功渲染', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('map-view')).toBeVisible();
  await expect(page.getByText('上海住房地图 MVP')).toBeVisible();
});

test('点击住宅后详情抽屉打开', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('residential-list').getByRole('button', { name: /静安公馆/ }).click();
  await expect(page.getByTestId('detail-panel')).toContainText('静安公馆');
  await expect(page.getByTestId('detail-panel')).toContainText('学区信息');
});

test('搜索与缩放聚合信息可见', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('搜索住宅').fill('浦东');
  await expect(page.getByTestId('residential-list')).toContainText('浦东滨江苑');
  const debug = page.getByTestId('cluster-debug');
  await expect(debug).toContainText('当前聚合结果');
});
