import { householdInvitationApi } from '../api/household-invitation.api.js';
import type { ReceivedInvitation } from '../types/household-invitation.js';

const REFRESH_INTERVAL_MS = 30_000;

class InvitationInbox {
  items = $state<ReceivedInvitation[]>([]);

  async refresh(): Promise<void> {
    try {
      this.items = await householdInvitationApi.listReceived();
    } catch {}
  }

  remove(invitationId: string): void {
    this.items = this.items.filter(({ id }) => id !== invitationId);
  }

  start(): () => void {
    void this.refresh();
    const interval = setInterval(() => void this.refresh(), REFRESH_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      this.items = [];
    };
  }
}

export const invitationInbox = new InvitationInbox();
