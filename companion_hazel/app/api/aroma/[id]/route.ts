import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * PATCH /api/aroma/[id]
 * Description: Updates the configuration for a specific aroma chamber.
 * Body: { intensity, color_hex, scent_name, isActive }
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { intensity, color_hex, scent_name, isActive } = body;

    const updatedConfig = await prisma.aromaConfiguration.update({
      where: { id: id },
      data: {
        intensity: intensity !== undefined ? parseInt(intensity) : undefined,
        color_hex: color_hex,
        scent_name: scent_name,
        isActive: isActive,
      },
    });

    return NextResponse.json({ message: 'Aroma configuration updated', data: updatedConfig });
  } catch (error) {
    console.error('Error updating aroma configuration:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
