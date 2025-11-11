/**
 * PlayerProgressManager - Tracks player progress across experiences
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ExperienceProgress {
  experienceId: string;
  completed: boolean;
  completedDate?: number;
  playTime?: number;
  attempts?: number;
}

export interface PlayerProfile {
  totalExperiencesCompleted: number;
  totalPlayTime: number;
  experiences: { [key: string]: ExperienceProgress };
}

export class PlayerProgressManager {
  private progressKey: string = '@escape_room_player_progress';
  private profile: PlayerProfile | null = null;

  /**
   * Load player progress from storage
   */
  async loadProgress(): Promise<PlayerProfile> {
    try {
      const jsonString = await AsyncStorage.getItem(this.progressKey);

      if (jsonString) {
        this.profile = JSON.parse(jsonString);
      } else {
        // Initialize new profile
        this.profile = {
          totalExperiencesCompleted: 0,
          totalPlayTime: 0,
          experiences: {}
        };
      }

      return this.profile;
    } catch (error) {
      console.error('Failed to load player progress:', error);
      // Return default profile on error
      this.profile = {
        totalExperiencesCompleted: 0,
        totalPlayTime: 0,
        experiences: {}
      };
      return this.profile;
    }
  }

  /**
   * Save player progress to storage
   */
  async saveProgress(): Promise<boolean> {
    if (!this.profile) {
      return false;
    }

    try {
      const jsonString = JSON.stringify(this.profile);
      await AsyncStorage.setItem(this.progressKey, jsonString);
      return true;
    } catch (error) {
      console.error('Failed to save player progress:', error);
      return false;
    }
  }

  /**
   * Mark an experience as started (increment attempts)
   */
  async startExperience(experienceId: string): Promise<void> {
    if (!this.profile) {
      await this.loadProgress();
    }

    if (!this.profile!.experiences[experienceId]) {
      this.profile!.experiences[experienceId] = {
        experienceId,
        completed: false,
        attempts: 1
      };
    } else {
      this.profile!.experiences[experienceId].attempts =
        (this.profile!.experiences[experienceId].attempts || 0) + 1;
    }

    await this.saveProgress();
  }

  /**
   * Mark an experience as completed
   */
  async completeExperience(experienceId: string, playTime: number): Promise<void> {
    if (!this.profile) {
      await this.loadProgress();
    }

    const wasCompleted = this.profile!.experiences[experienceId]?.completed || false;

    this.profile!.experiences[experienceId] = {
      experienceId,
      completed: true,
      completedDate: Date.now(),
      playTime,
      attempts: this.profile!.experiences[experienceId]?.attempts || 1
    };

    // Update totals only if this is the first completion
    if (!wasCompleted) {
      this.profile!.totalExperiencesCompleted++;
    }
    this.profile!.totalPlayTime += playTime;

    await this.saveProgress();
  }

  /**
   * Check if an experience has been completed
   */
  isExperienceCompleted(experienceId: string): boolean {
    if (!this.profile) {
      return false;
    }
    return this.profile.experiences[experienceId]?.completed || false;
  }

  /**
   * Get progress for a specific experience
   */
  getExperienceProgress(experienceId: string): ExperienceProgress | null {
    if (!this.profile) {
      return null;
    }
    return this.profile.experiences[experienceId] || null;
  }

  /**
   * Get the player profile
   */
  getProfile(): PlayerProfile | null {
    return this.profile;
  }

  /**
   * Reset all progress (for testing or user request)
   */
  async resetProgress(): Promise<void> {
    this.profile = {
      totalExperiencesCompleted: 0,
      totalPlayTime: 0,
      experiences: {}
    };
    await this.saveProgress();
  }
}

// Singleton instance
export const playerProgressManager = new PlayerProgressManager();
