import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * @swagger
 * /api/aroma/{id}:
 *   patch:
 *     summary: Update aroma configuration
 *     description: Updates the configuration for a specific aroma chamber.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The UUID of the aroma configuration.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               intensity:
 *                 type: integer
 *               color_hex:
 *                 type: string
 *               scent_name:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Aroma configuration updated successfully
 *       500:
 *         description: Server error
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
