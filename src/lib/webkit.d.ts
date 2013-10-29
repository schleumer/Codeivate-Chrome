declare module webkitNotifications {

	interface Notification {
		show: () => void;
	}

	export function createNotification(icon: string, title: string, body: string): Notification;

}