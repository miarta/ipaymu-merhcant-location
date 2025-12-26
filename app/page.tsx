import { promises as fs } from 'fs';
import path from 'path';
import { CoordinateData } from '@/components/Map';
import MainLayout from '@/components/MainLayout';

async function getData() {
  const filePath = path.join(process.cwd(), 'public', 'koordinat.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  return JSON.parse(fileContents) as CoordinateData[];
}

export default async function Home() {
  const data = await getData();

  return <MainLayout data={data} />;
}
