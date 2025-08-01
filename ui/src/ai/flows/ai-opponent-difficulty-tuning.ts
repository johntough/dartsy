'use server';
/**
 * @fileOverview An AI agent that adjusts the difficulty of the AI opponent in the Dartsy game based on the player's performance.
 *
 * - adjustDifficulty - A function that adjusts the AI opponent's difficulty.
 * - AdjustDifficultyInput - The input type for the adjustDifficulty function.
 * - AdjustDifficultyOutput - The return type for the adjustDifficulty function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdjustDifficultyInputSchema = z.object({
  playerScore: z.number().describe('The current score of the player.'),
  aiScore: z.number().describe('The current score of the AI opponent.'),
  playerAverageScore: z
    .number()
    .describe('The average score of the player per round.'),
  aiAverageScore: z
    .number()
    .describe('The average score of the AI opponent per round.'),
  roundsPlayed: z.number().describe('The number of rounds played in the game.'),
});
export type AdjustDifficultyInput = z.infer<typeof AdjustDifficultyInputSchema>;

const AdjustDifficultyOutputSchema = z.object({
  difficultyAdjustment: z
    .number()
    .describe(
      'A number between -1 and 1 indicating the adjustment to the AI difficulty. -1 means make it easier, 1 means make it harder, 0 means no change.'
    ),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the difficulty adjustment, explaining why the AI is making the change.'
    ),
});
export type AdjustDifficultyOutput = z.infer<typeof AdjustDifficultyOutputSchema>;

export async function adjustDifficulty(
  input: AdjustDifficultyInput
): Promise<AdjustDifficultyOutput> {
  return adjustDifficultyFlow(input);
}

const adjustDifficultyPrompt = ai.definePrompt({
  name: 'adjustDifficultyPrompt',
  input: {schema: AdjustDifficultyInputSchema},
  output: {schema: AdjustDifficultyOutputSchema},
  prompt: `You are an expert game balancer, tasked with adjusting the difficulty of an AI opponent in a darts game to provide an engaging experience for the player.

  Here's the current game state:
  - Player Score: {{{playerScore}}}
  - AI Score: {{{aiScore}}}
  - Player Average Score: {{{playerAverageScore}}}
  - AI Average Score: {{{aiAverageScore}}}
  - Rounds Played: {{{roundsPlayed}}}

  Based on this information, determine whether the AI opponent should become more challenging, less challenging, or stay the same.

  Consider these factors:
  - If the player is consistently winning (playerScore is much lower than aiScore, and playerAverageScore is higher than aiAverageScore), the AI should become more challenging.
  - If the player is consistently losing, the AI should become less challenging.
  - If the game is close and competitive, the AI should stay at the same difficulty.
  - The AI difficulty can be adjusted gradually, from -1 to 1.

  Provide a difficultyAdjustment value and reasoning for the change.
  Remember that the difficultyAdjustment should be a number between -1 and 1, explaining the reason behind the adjustment.
  `,
});

const adjustDifficultyFlow = ai.defineFlow(
  {
    name: 'adjustDifficultyFlow',
    inputSchema: AdjustDifficultyInputSchema,
    outputSchema: AdjustDifficultyOutputSchema,
  },
  async input => {
    const {output} = await adjustDifficultyPrompt(input);
    return output!;
  }
);
