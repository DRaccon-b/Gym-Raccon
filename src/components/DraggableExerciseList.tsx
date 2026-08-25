import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, PanResponder, Platform } from 'react-native';
import { Exercise } from '../types';
import { colors, radius } from '../theme';
import ExercisePhotoPicker from './ExercisePhotoPicker';

const ROW_HEIGHT = 72;
const ROW_GAP = 8;
const SLOT_HEIGHT = ROW_HEIGHT + ROW_GAP;

type Props = {
  exercises: Exercise[];
  editingExerciseId?: string;
  accentColor: string;
  onReorder: (next: Exercise[]) => void;
  onPressItem: (ex: Exercise) => void;
  onRemove: (id: string) => void;
  onPhotoChange: (id: string, uri: string | undefined) => void;
};

export default function DraggableExerciseList({
  exercises,
  editingExerciseId,
  accentColor,
  onReorder,
  onPressItem,
  onRemove,
  onPhotoChange,
}: Props) {
  const [order, setOrder] = useState(exercises);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragIndexRef = useRef(0);
  const dragY = useRef(new Animated.Value(0)).current;
  const orderRef = useRef(order);
  orderRef.current = order;

  useEffect(() => {
    if (!draggingId) setOrder(exercises);
  }, [exercises, draggingId]);

  function makePanResponder(id: string) {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: () => {
        dragIndexRef.current = orderRef.current.findIndex((e) => e.id === id);
        dragY.setValue(0);
        setDraggingId(id);
      },
      onPanResponderMove: (_evt, gesture) => {
        dragY.setValue(gesture.dy);
        const targetIndex = Math.max(
          0,
          Math.min(
            orderRef.current.length - 1,
            Math.round((dragIndexRef.current * SLOT_HEIGHT + gesture.dy) / SLOT_HEIGHT)
          )
        );
        const currentIndex = orderRef.current.findIndex((e) => e.id === id);
        if (targetIndex !== currentIndex) {
          const next = [...orderRef.current];
          const [moved] = next.splice(currentIndex, 1);
          next.splice(targetIndex, 0, moved);
          setOrder(next);
        }
      },
      onPanResponderRelease: () => {
        setDraggingId(null);
        dragY.setValue(0);
        onReorder(orderRef.current);
      },
      onPanResponderTerminate: () => {
        setDraggingId(null);
        dragY.setValue(0);
        onReorder(orderRef.current);
      },
    });
  }

  const panResponders = useRef<Record<string, ReturnType<typeof PanResponder.create>>>({});
  order.forEach((ex) => {
    if (!panResponders.current[ex.id]) {
      panResponders.current[ex.id] = makePanResponder(ex.id);
    }
  });

  return (
    <View style={{ height: order.length * SLOT_HEIGHT }}>
      {order.map((ex, index) => {
        const isDragging = ex.id === draggingId;
        const top = isDragging ? dragIndexRef.current * SLOT_HEIGHT : index * SLOT_HEIGHT;
        return (
          <Animated.View
            key={ex.id}
            style={[
              styles.row,
              editingExerciseId === ex.id && { borderColor: accentColor },
              {
                position: 'absolute',
                left: 0,
                right: 0,
                top,
                transform: isDragging ? [{ translateY: dragY }] : [],
                zIndex: isDragging ? 10 : 1,
                elevation: isDragging ? 10 : 1,
              },
            ]}
          >
            <View
              {...panResponders.current[ex.id].panHandlers}
              style={[styles.dragHandle, Platform.OS === 'web' && webDragHandleStyle]}
            >
              <Text style={styles.dragHandleText}>⠿</Text>
            </View>
            <ExercisePhotoPicker
              photoUri={ex.photoUri}
              onChange={(uri) => onPhotoChange(ex.id, uri)}
              size={48}
            />
            <TouchableOpacity style={styles.info} onPress={() => onPressItem(ex)}>
              <Text style={styles.exerciseText} numberOfLines={1}>
                {ex.name} — {ex.sets}×{ex.reps}
              </Text>
              <Text style={styles.editHint}>Antippen zum Bearbeiten</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onRemove(ex.id)}>
              <Text style={[styles.removeText, { color: accentColor }]}>Entfernen</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );
}

const webDragHandleStyle =
  Platform.OS === 'web' ? ({ touchAction: 'none', userSelect: 'none', cursor: 'grab' } as any) : {};

const styles = StyleSheet.create({
  row: {
    height: ROW_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 8,
  },
  dragHandle: { paddingHorizontal: 4, paddingVertical: 12 },
  dragHandleText: { color: colors.textMuted, fontSize: 20, fontWeight: '700' },
  info: { flex: 1 },
  exerciseText: { color: colors.textPrimary, fontSize: 15 },
  editHint: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  removeText: { fontSize: 13, fontWeight: '600' },
});
