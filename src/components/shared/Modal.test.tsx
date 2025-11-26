import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from '../../../components/shared/Modal';

describe('Modal', () => {
  it('should not render when closed', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        <div>Modal content</div>
      </Modal>
    );

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('should render when open', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <div>Modal content</div>
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <div>Modal content</div>
      </Modal>
    );

    const closeButton = screen.getByLabelText('Close modal');
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });


  it('should call onClose when Escape key is pressed', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <div>Modal content</div>
      </Modal>
    );

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should not call onClose when clicking inside modal content', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <div>Modal content</div>
      </Modal>
    );

    const content = screen.getByText('Modal content');
    await user.click(content);

    expect(onClose).not.toHaveBeenCalled();
  });

  it('should apply correct size classes', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal" size="sm">
        <div>Content</div>
      </Modal>
    );

    let modalContainer = screen.getByText('Test Modal').closest('div')?.parentElement as HTMLElement;
    expect(modalContainer.className).toContain('max-w-md');

    rerender(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal" size="lg">
        <div>Content</div>
      </Modal>
    );

    modalContainer = screen.getByText('Test Modal').closest('div')?.parentElement as HTMLElement;
    expect(modalContainer.className).toContain('max-w-2xl');
  });

  it('should lock body scroll when open', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <div>Content</div>
      </Modal>
    );

    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        <div>Content</div>
      </Modal>
    );

    expect(document.body.style.overflow).toBe('unset');
  });
});
