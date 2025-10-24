import { NextRequest } from 'next/server';
import { submitContactForm } from '@/backend/api/contact/handlers';

export async function POST(request: NextRequest) {
  return submitContactForm(request);
}