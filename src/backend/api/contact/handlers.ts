import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { ContactFormData } from '@/shared/types';

export async function submitContactForm(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            message: 'All fields are required',
            code: 'VALIDATION_ERROR'
          }
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            message: 'Please provide a valid email address',
            code: 'INVALID_EMAIL'
          }
        },
        { status: 400 }
      );
    }

    // Validate message length
    if (body.message.trim().length < 10) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            message: 'Message must be at least 10 characters long',
            code: 'MESSAGE_TOO_SHORT'
          }
        },
        { status: 400 }
      );
    }

    // Save to database
    const contactSubmission = await prisma.contactSubmission.create({
      data: {
        name: body.name.trim(),
        email: body.email.trim().toLowerCase(),
        message: body.message.trim(),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: contactSubmission.id,
        message: 'Contact form submitted successfully'
      }
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          message: 'Internal server error. Please try again later.',
          code: 'INTERNAL_ERROR'
        }
      },
      { status: 500 }
    );
  }
}